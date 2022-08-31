using Microsoft.EntityFrameworkCore;
using ShopApp.Interfaces;
using ShopApp.Models;
using System.Linq;

namespace ShopApp.Repository
{
    public class ShopRepository : IShopRepository
    {
        private readonly AppDbContext _context;

        public ShopRepository(AppDbContext context)
        {
            this._context = context;
        }

        public IQueryable<Shop> GetAll()
        {
            return _context.Shops;
        }

        public Shop GetById(int id)
        {
            return _context.Shops.FirstOrDefault(p => p.Id == id);
        }

        public void Add(Shop book)
        {
            _context.Shops.Add(book);
            _context.SaveChanges();
        }

        public void Update(Shop book)
        {
            _context.Entry(book).State = EntityState.Modified;

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
        }

        public void Delete(Shop book)
        {
            _context.Shops.Remove(book);
            _context.SaveChanges();
        }
    }
}
