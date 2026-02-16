namespace HIMS.Model.Dispensary
{
    public class Medicine:BaseEntity
    {
        public string Name { get; set; }
        public string GenericName { get; set; }
        public string Category { get; set; }
        public string Manufacturer { get; set; }
        public int StockQuantity { get; set; }
        public decimal UnitPrice { get; set; }
        public bool isActive { get; set; }
        public DateTime ExpiryDate { get; set; }
    }
}
