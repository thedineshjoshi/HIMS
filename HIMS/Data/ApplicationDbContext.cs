using HIMS.Model.Clinical_And_Scheduling_Entities;
using HIMS.Model.Core_People_Entities;
using HIMS.Model.Dispensary;
using HIMS.Model.Facility_And_Operational_Entities;
using HIMS.Model.Invoice_And_Bill;
using HIMS.Model.Lab_Entities;
using Microsoft.EntityFrameworkCore;

namespace HIMS.Data
{
    public class ApplicationDbContext:DbContext
    {
        public ApplicationDbContext()
        {
        }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<MedicalRecord> MedicalRecords { get; set; }
        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Staff> Staffs { get; set; }
        public DbSet<Medicine>Medicines { get; set; }
        public DbSet<InPatientAdmission> InPatientAdmissions { get; set; }
        public DbSet<Ward_Room> WardRooms { get; set; }
        public DbSet<Bill> Bills { get; set; }
        public DbSet<LabTest>LabTests { get; set; }

    }
}
