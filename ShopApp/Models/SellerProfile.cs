using AutoMapper;
using ShopApp.Models.DTO;

namespace ShopApp.Models
{
    public class SellerProfile : Profile
    {

        public SellerProfile()
        {
            CreateMap<Seller, SellerDTO>();
        }

    }
}
