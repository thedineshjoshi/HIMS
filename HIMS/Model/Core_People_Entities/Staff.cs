using HIMS.Common;
using HIMS.Model.Enums;

namespace HIMS.Model.Core_People_Entities
{
    public class Staff: People
    {
        public string Salutation { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public bool IsDefaultPasswordChanged { get; set; }
        public Role_Enum Role { get; set; }
        public DateOnly HiringDate { get; set; }
        public double Salary { get; set; }
    }

}
