using ShopApp.Interfaces;
using ShopApp.Models;
using ShopApp.Models.DTO;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ShopApp.Repository
{
    public class StatisticsRepository : IStatisticsRepository
    {
        private readonly AppDbContext _context;

        public StatisticsRepository(AppDbContext context)
        {
            this._context = context;
        }

        public StatisticsDTO GetStatistics()
        {
            return new StatisticsDTO()
            {
                SellerAges = GetAgeForSellers(),
                AverageShopAge = GetAverageAgeForSellersInShops(),
                TotalShopAge = GetTotalAgeForSellersInShops()
            };
        }

        private List<SellerAgeDTO> GetAgeForSellers()
        {
            return _context.Sellers.Select(s =>
                new SellerAgeDTO()
                {
                    Id = s.Id,
                    Seller = s.Name + " " + s.Surname,
                    Age = DateTime.Now.Year - s.Year
                }
                ).ToList();
        }

        private List<ShopAgeDTO> GetAverageAgeForSellersInShops()
        {
            return _context.Sellers.GroupBy(s => s.ShopId).Select(s =>
                new ShopAgeDTO()
                {
                    Name = _context.Shops.Where(shop => shop.Id == s.Key).Select(s => s.Name).Single(),
                    AverageAge = s.Average(s => DateTime.Now.Year - s.Year)
                }
                ).ToList();
        }

        private List<ShopTotalAgeDTO> GetTotalAgeForSellersInShops()
        {
            return _context.Sellers.GroupBy(s => s.ShopId).Select(s =>
                new ShopTotalAgeDTO()
                {
                    Name = _context.Shops.Where(shop => shop.Id == s.Key).Select(s => s.Name).Single(),
                    TotalAge = s.Sum(s => DateTime.Now.Year - s.Year)
                }
                ).ToList();
        }
    }
}
