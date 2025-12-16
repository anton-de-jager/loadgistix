namespace loadgistix.api.Helpers
{
    public partial class ProcedureResult
    {
        public Guid Id { get; set; }
        public bool Result { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }
    }
}
