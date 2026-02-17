namespace HIMS.Common
{
    public abstract class People
    {
        public Guid Id { get; set; }
            public string FirstName { get; set; }
            public string MiddleName { get; set; }
            public string LastName { get; set; }
            public string Gender { get; set; }
            public string Address { get; set; }
            public string ContactNumber { get; set; }
            public string Email { get; set; }
        public bool IsActive { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public DateTime CreatedOn { get; set; }
        public Guid CreatedBy { get; set; }
        public Guid? UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }

        public virtual int GetAge()
        {
            return DateTime.Now.Year - DateOfBirth.Year;
        }
    }
}
