using HIMS.Model.Core_People_Entities;

namespace HIMS.Model.Facility_And_Operational_Entities
{
    public class InPatientAdmission:BaseEntity
    {
        public Guid PatientId { get; set; }
        public virtual Patient Patient { get; set; }
        public Guid WardRoomId { get; set; }
        public virtual Ward_Room WardRoom { get; set; }
        public string ReasonForAdmission { get; set; }
        public bool isActive { get; set; }
        public DateTime AdmissionDate { get; set; }
        public DateTime? DischargeDate { get; set; }

    }
}
