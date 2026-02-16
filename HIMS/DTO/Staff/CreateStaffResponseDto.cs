namespace HIMS.DTO.Staff
{
    public class CreateStaffResponseDto
    {
        public Guid StaffId { get; set; }
        public Guid? DoctorId { get; set; }
    }
}
