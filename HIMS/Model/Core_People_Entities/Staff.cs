using HIMS.Common;
using HIMS.Model.Enums;

namespace HIMS.Model.Core_People_Entities
{
    public class Staff: People
    {
        public string Salutation { get; set; }
        public Role_Enum Role { get; set; }
        public DateOnly HiringDate { get; set; }
        public double Salary { get; set; }
        public bool IsActive { get; set; }
    }

}
