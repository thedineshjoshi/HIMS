using HIMS.Model.Core_People_Entities;
using HIMS.Model.Enums;

namespace HIMS.Model.Invoice_And_Bill
{
    public class Bill: BaseEntity
    {
        public Guid PatientId { get; set; }
        public virtual Patient Patient { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public PaymentStatus_Enum PaymentStatus { get; set; }
        public PaymentMethod_Enum PaymentMethod { get; set; }
        public DateTime BillingDate { get; set; }
    }
}
