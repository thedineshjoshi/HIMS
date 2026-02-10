namespace HIMS.Model.Invoice_And_Bill
{
    public class Bill
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public string PaymentStatus { get; set; } // e.g., Paid, Unpaid, Pending
        public string PaymentMethod { get; set; } // e.g., Cash, Credit Card, Insurance
        public DateTime BillingDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
