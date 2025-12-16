using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace loadgistix.api.Helpers
{
    public class PayfastRequest
    {
        public string m_payment_id { get; set; }
        public string pf_payment_id { get; set; }
        public string payment_status { get; set; }
        public string item_name { get; set; }
        public string item_description { get; set; }
        public double amount_gross { get; set; }
        public string amount_fee { get; set; }
        public string amount_net { get; set; }
        public string custom_str1 { get; set; }
        public string custom_str2 { get; set; }
        public string custom_str3 { get; set; }
        public string custom_str4 { get; set; }
        public string custom_str5 { get; set; }
        public int custom_int1 { get; set; }
        public int custom_int2 { get; set; }
        public int custom_int3 { get; set; }
        public int custom_int4 { get; set; }
        public int custom_int5 { get; set; }
        public string name_first { get; set; }
        public string name_last { get; set; }
        public string email_address { get; set; }
        public string merchant_id { get; set; }
        public string token { get; set; }
        public string billing_date { get; set; }
        public string signature { get; set; }
    }
}
