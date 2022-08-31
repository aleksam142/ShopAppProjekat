using ShopApp.Models.DTO;

namespace ShopApp.Interfaces
{
    public interface IStatisticsRepository
    {
        StatisticsDTO GetStatistics();
    }
}
