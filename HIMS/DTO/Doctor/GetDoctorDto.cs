namespace HIMS.DTO.Doctor
{
    public class GetDoctorDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Specialization { get; set; }
        public string Department { get; set; }
        public string Qualification { get; set; }
        public string LicenseNumber { get; set; }
        public DateOnly HiringDate { get; set; }
    }
}
