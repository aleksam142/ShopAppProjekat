using ShopApp.Models;
using System.Linq;

namespace ShopApp.Interfaces
{
    public interface IShopRepository
    {

        IQueryable<Shop> GetAll();
        Shop GetById(int id);
        void Add(Shop shop);
        void Update(Shop shop);
        void Delete(Shop shop);

    }
}
