using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ShopApp.Interfaces;
using ShopApp.Models;
using ShopApp.Models.DTO;
using System.Linq;

namespace ShopApp.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SellersController : ControllerBase
    {
        private readonly ISellerRepository _sellerRepository;
        private readonly IMapper _mapper;

        public SellersController(ISellerRepository sellerRepository, IMapper mapper)
        {
            _sellerRepository = sellerRepository;
            _mapper = mapper;
        }

        // GET: api/Sellers
        [AllowAnonymous]
        [HttpGet]
        public IActionResult GetSellers()
        {
            return Ok(_sellerRepository.GetAll().ProjectTo<SellerDTO>(_mapper.ConfigurationProvider).ToList());
        }


        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        // GET: api/Sellers/5
        [HttpGet("{id}")]
        public IActionResult GetSeller(int id)
        {
            var seller = _sellerRepository.GetById(id);
            if (seller == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<SellerDTO>(seller));
        }


        // PUT: api/Sellers/5
        [HttpPut("{id}")]
        public IActionResult PutSeller(int id, Seller seller)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != seller.Id)
            {
                return BadRequest();
            }

            try
            {
                _sellerRepository.Update(seller);
            }
            catch
            {
                return BadRequest();
            }

            return Ok(seller);
        }

        // POST: api/Sellers
        [HttpPost]
        public IActionResult PostSeller(Seller seller)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _sellerRepository.Add(seller);
            return CreatedAtAction("GetSeller", new { id = seller.Id }, seller);
        }

        // DELETE: api/Sellers/5
        [HttpDelete("{id}")]
        public IActionResult DeleteSeller(int id)
        {
            var seller = _sellerRepository.GetById(id);
            if (seller == null)
            {
                return NotFound();
            }

            _sellerRepository.Delete(seller);
            return NoContent();
        }
    }
}
