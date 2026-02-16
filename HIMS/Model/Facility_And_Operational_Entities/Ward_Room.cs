using HIMS.Model.Enums;

namespace HIMS.Model.Facility_And_Operational_Entities
{
    public class Ward_Room:BaseEntity
    {
        public string RoomNumber { get; set; }
        public WardType_Enum WardType { get; set; } 
        public int Capacity { get; set; }
        public bool IsOccupied { get; set; }
        public virtual ICollection<InPatientAdmission> Admissions { get; set; }
    }
}
