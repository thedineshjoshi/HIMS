using HIMS.DTO.Pagination;
using HIMS.DTO.Response;
using HIMS.DTO.Staff;
using HIMS.Interfaces;
using HIMS.Model.Core_People_Entities;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HIMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        private readonly IStaffService staffService;
        public StaffController(IStaffService staffService)
        {
            this.staffService = staffService;
        }
        // GET: api/<StaffController>
        [HttpGet]
        public async Task<ActionResult<PagedResponseDto<GetStaffDto>>> GetAllStaff([FromQuery] PagingRequestDto request)
        {
            var pagedStaff = await staffService.GetAllStaffAsync(request);

            return Ok(pagedStaff);
        }

        // GET api/<StaffController>/5
        [HttpGet("{id}")]
        public async Task<GetStaffDto> GetStaffByIdAsync(Guid id)
        {
            return await staffService.GetStaffByIdAsync(id);
        }

        // POST api/<StaffController>
        [HttpPost]
        public async Task<IActionResult> AddStaffAsync([FromBody] CreateStaffDto newStaff)
        {
          
            return Ok(await staffService.AddStaffAsync(newStaff)) ;
        }

        // PUT api/<StaffController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStaffAsync(Guid id, [FromBody] UpdateStaffDto staffDto)
        {
            return Ok(await staffService.UpdateStaffAsync(id, staffDto));
        }

        // DELETE api/<StaffController>/5
        [HttpDelete("{id}")]
        public async Task<ResponseDto> DeleteStaffAsync(Guid id)
        {
            return await staffService.DeleteStaffAsync(id);
        }
    }
}
