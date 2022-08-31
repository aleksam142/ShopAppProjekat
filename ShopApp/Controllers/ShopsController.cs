using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ShopApp.Interfaces;
using ShopApp.Models;
using System.Linq;

namespace ShopApp.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ShopsController : ControllerBase
    {
        private readonly IShopRepository _shopRepository;

        public ShopsController(IShopRepository shopRepository)
        {
            _shopRepository = shopRepository;
        }

        // GET: api/Shops
        [HttpGet]
        public IActionResult GetShops()
        {

            return Ok(_shopRepository.GetAll().ToList());
        }

        // GET: api/Shops/5
        [HttpGet("{id}")]
        public IActionResult GetShop(int id)
        {
            var shop = _shopRepository.GetById(id);
            if (shop == null)
            {
                return NotFound();
            }

            return Ok(shop);
        }


        // PUT: api/Shops/5
        [HttpPut("{id}")]
        public IActionResult PutShop(int id, Shop shop)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != shop.Id)
            {
                return BadRequest();
            }

            try
            {
                _shopRepository.Update(shop);
            }
            catch
            {
                return BadRequest();
            }

            return Ok(shop);
        }

        // POST: api/Shops
        [HttpPost]
        public IActionResult PostShop(Shop shop)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _shopRepository.Add(shop);
            return CreatedAtAction("GetShop", new { id = shop.Id }, shop);
        }

        // DELETE: api/Shops/5
        [HttpDelete("{id}")]
        public IActionResult DeleteShop(int id)
        {
            var shop = _shopRepository.GetById(id);
            if (shop == null)
            {
                return NotFound();
            }

            _shopRepository.Delete(shop);
            return NoContent();
        }
    }
}
