namespace HIMS.Model.Facility_And_Operational_Entities
{
    public class InPatientAdmission
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public Guid WardRoomId { get; set; }
        public string ReasonForAdmission { get; set; }
        public DateTime AdmissionDate { get; set; }
        public DateTime? DischargeDate { get; set; }

    }
}
