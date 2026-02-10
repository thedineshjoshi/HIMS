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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Doctor)
                .WithMany(d => d.Appointments)
                .HasForeignKey(a => a.DoctorId);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Patient)
                .WithMany(p => p.Appointments)
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<MedicalRecord>()
                .HasOne(m => m.Doctor)
                .WithMany(d => d.MedicalRecords)
                .HasForeignKey(m => m.DoctorId);

            modelBuilder.Entity<MedicalRecord>()
                .HasOne(mr => mr.Patient)
                .WithMany(p => p.MedicalRecords)
                .HasForeignKey(mr => mr.PatientId);

            modelBuilder.Entity<LabTest>()
                .HasOne(lt => lt.Patient)
                .WithMany()
                .HasForeignKey(lt => lt.PatientId);

            modelBuilder.Entity<LabTest>()
                .HasOne(lt => lt.Doctor)
                .WithMany()
                .HasForeignKey(lt => lt.DoctorId);

            modelBuilder.Entity<InPatientAdmission>()
                .HasOne(ipa => ipa.WardRoom)
                .WithMany(wr => wr.Admissions)
                .HasForeignKey(ipa => ipa.WardRoomId);

            modelBuilder.Entity<Prescription>()
                .HasOne(pr => pr.Patient)
                .WithMany(p => p.Prescriptions)
                .HasForeignKey(pr => pr.PatientId);

            modelBuilder.Entity<Prescription>()
                .HasOne(pr => pr.Doctor)
                .WithMany() 
                .HasForeignKey(pr => pr.DoctorId);
        }

    }
}
