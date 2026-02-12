using HIMS.Data;
using HIMS.DTO.Appointment;
using HIMS.Interfaces;
using HIMS.Model.Clinical_And_Scheduling_Entities;
using HIMS.Model.Core_People_Entities;
using HIMS.Model.Enums;
using Microsoft.EntityFrameworkCore;

namespace HIMS.Services
{
    public class AppointmentService:IAppointmentService
    {
        private readonly ApplicationDbContext db;
        public AppointmentService(ApplicationDbContext db)
        {
            this.db = db;
        }
        public async Task<List<GetAppointmentDto>> GetAllAppointmentsAsync()
        {
            return await db.Appointments.Select(a => new GetAppointmentDto
            {
                Id = a.Id,
                AppointmentDate = a.AppointmentDate,
                ReasonForVisit = a.ReasonForVisit,
                Status = a.Status.ToString(),

                PatientId = a.PatientId,
                PatientName = $"{a.Patient.FirstName} {a.Patient.LastName}",
                PatientContact = a.Patient.ContactNumber,

                DoctorId = a.DoctorId,
                DoctorName = $"Dr. {a.Doctor.LastName}"
            })
        .ToListAsync(); ;
        }
        
        public async Task<GetAppointmentDto?> GetAppointmentByIdAsync(Guid id)
        {
            return await db.Appointments
                .Select(a => new GetAppointmentDto
                {
                    Id = a.Id,
                    AppointmentDate = a.AppointmentDate,
                    ReasonForVisit = a.ReasonForVisit,
                    Status = a.Status.ToString(),

                    PatientId = a.PatientId,
                    PatientName = $"{a.Patient.FirstName} {a.Patient.LastName}",
                    PatientContact = a.Patient.ContactNumber,

                    DoctorId = a.DoctorId,
                    DoctorName = $"Dr. {a.Doctor.LastName}"
                })
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<Patient?> CheckPatientExistsAsync(PatientCheckDto dto)
        {
            var patient = await db.Patients
                .FirstOrDefaultAsync(p =>
                    p.FirstName == dto.FirstName &&
                    p.MiddleName == dto.MiddleName &&
                    p.LastName == dto.LastName &&
                    p.ContactNumber == dto.ContactNumber);

            return patient; 
        }
        public async Task<Appointment> AddAppointmentAsync(CreateAppointmentDto dto)
        {
            var doctorExists = await db.Doctors.AnyAsync(d => d.Id == dto.DoctorId);
            if (!doctorExists)
                throw new Exception("Doctor does not exist.");

            var patient = await db.Patients.FirstOrDefaultAsync(p =>
                                                                    p.FirstName == dto.FirstName &&
                                                                    p.MiddleName == dto.MiddleName &&
                                                                    p.LastName == dto.LastName &&
                                                                    p.ContactNumber == dto.ContactNumber
                                                                );

            if (patient == null)
            {
                patient = new Patient
                {
                    Id = Guid.NewGuid(),
                    FirstName = dto.FirstName,
                    MiddleName = dto.MiddleName,
                    LastName = dto.LastName,
                    ContactNumber = dto.ContactNumber,
                    DateOfBirth = dto.DateOfBirth,
                    BloodGroup = dto.BloodGroup,
                    Email = dto.Email,
                    Address= dto.Address,
                    Gender=dto.Gender,
                    CreatedAt =DateTime.UtcNow,
                    UpdatedAt=DateTime.UtcNow
                };

                await db.Patients.AddAsync(patient);
                await db.SaveChangesAsync();
            }

            var appointment = new Appointment
            {
                Id = Guid.NewGuid(),
                PatientId = patient.Id,
                DoctorId = dto.DoctorId,
                AppointmentDate = dto.AppointmentDate,
                ReasonForVisit = dto.ReasonForVisit,
                Status = AppointmentStatus_Enum.Scheduled,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await db.Appointments.AddAsync(appointment);
            await db.SaveChangesAsync();

            return appointment;
        }

        public async Task<bool> UpdateAppointmentAsync(Guid Id , AppointmentStatus_Enum status)
        {
            var appointment = await db.Appointments.FindAsync(Id);

            if (appointment == null)
                return false;

            appointment.Status = status;
            appointment.UpdatedAt = DateTime.UtcNow;

            await db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAppointmentAsync(Guid id)
        {
            var appointment = await db.Appointments.FindAsync(id);

            if (appointment == null)
                return false;

            db.Appointments.Remove(appointment);
            await db.SaveChangesAsync();

            return true;
        }
    }
}
