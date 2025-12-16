using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace loadgistix.api.Models
{
    public partial class DirectoriesAvailableRequest
    {
        public string? DirectoryCategories { get; set; }
        public float? Lat { get; set; }
        public float? Lon { get; set; }
        public string? Distance { get; set; }
    }
}
