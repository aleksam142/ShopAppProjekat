using System.Collections.Generic;

namespace ShopApp.Models.DTO
{
    public class StatisticsDTO
    {

        public List<SellerAgeDTO> SellerAges { get; set; }
        public List<ShopAgeDTO> AverageShopAge { get; set; }
        public List<ShopTotalAgeDTO> TotalShopAge { get; set; }

    }
}
