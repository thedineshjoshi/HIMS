using HIMS.Model.Enums;

namespace HIMS.DTO.Staff
{
    public class UpdateStaffDto
    {
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public string Address { get; set; }
        public string ContactNumber { get; set; }
        public string Email { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string Salutation { get; set; }
        public Role_Enum Role { get; set; }
        public DateOnly HiringDate { get; set; }
        public double Salary { get; set; }
        public Guid UpdatedBy { get; set; }
    }
}
