namespace HIMS.Model.Facility_And_Operational_Entities
{
    public class Ward_Room
    {
        public Guid Id { get; set; }
        public string RoomNumber { get; set; }
        public WardType_Enum WardType { get; set; } 
        public int Capacity { get; set; }
        public bool IsOccupied { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public virtual ICollection<InPatientAdmission> Admissions { get; set; }
    }
}
