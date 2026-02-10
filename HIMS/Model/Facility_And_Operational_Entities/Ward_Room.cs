namespace HIMS.Model.Facility_And_Operational_Entities
{
    public class Ward_Room
    {
        public Guid Id { get; set; }
        public string RoomNumber { get; set; }
        public string WardType { get; set; } // e.g., General, ICU, Maternity
        public int Capacity { get; set; }
        public bool IsOccupied { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
