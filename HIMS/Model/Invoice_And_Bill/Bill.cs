using HIMS.Model.Core_People_Entities;

namespace HIMS.Model.Invoice_And_Bill
{
    public class Bill
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public virtual Patient Patient { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public PaymentStatus_Enum PaymentStatus { get; set; } // e.g., Paid, Unpaid, Pending
        public PaymentMethod_Enum PaymentMethod { get; set; } // e.g., Cash, Credit Card, Insurance
        public DateTime BillingDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
