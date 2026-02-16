namespace HIMS.Model
{
    public class BaseEntity
    {
        public Guid Id { get; set; }
        public DateTime CreatedOn { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public DateTime? UpdatedBy { get; set; }
    }
}
