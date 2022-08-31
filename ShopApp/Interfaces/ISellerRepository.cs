using ShopApp.Models;
using System.Linq;

namespace ShopApp.Interfaces
{
    public interface ISellerRepository
    {

        IQueryable<Seller> GetAll();
        Seller GetById(int id);
        void Add(Seller seller);
        void Update(Seller seller);
        void Delete(Seller seller);

    }
}
