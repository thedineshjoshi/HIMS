namespace HIMS.DTO.Patient
{
    public class UpdatePatientDto
    {
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public string Address { get; set; }
        public string ContactNumber { get; set; }
        public string Email { get; set; }
        public string BloodGroup { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public Guid UpdatedBy { get; set; }
    }
}
