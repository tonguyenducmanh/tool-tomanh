using System.Numerics.Tensors;
using System.Runtime.InteropServices.JavaScript;
using System.Text.Json;
using System.Text.Json.Serialization;
namespace Tools.NetWrapper
{

    /// <summary>
    /// phải có class này để hỗ trợ System.Text.Json source generator
    /// </summary>
    [JsonSerializable(typeof(CosinSimilarityInput))]
    public partial class AppJsonContext : JsonSerializerContext
    {
    }

    /// <summary>
    /// Class chứa danh sách các hàm tiện ích liên quan đến Tensor
    /// </summary>
    public static partial class ToolsTensor
    {
        [JSExport]
        public static string CosinSimilarity(string source)
        {
            //return source + " - from ToolsTensor";
            if (string.IsNullOrEmpty(source))
            {
                throw new ArgumentNullException(nameof(source));
            }
            // không deserialize trực tiếp được vì thiếu tham chiếu System.Text.Json source generator
            var input = (CosinSimilarityInput)JsonSerializer.Deserialize(source, typeof(CosinSimilarityInput), AppJsonContext.Default);

            if (input == null || input.FirstVector == null || input.SecondVector == null)
            {
                throw new ArgumentException("Invalid input data");
            }
            // Tạo hai tensor mẫu
            var result = TensorPrimitives.CosineSimilarity(input.FirstVector, input.SecondVector);
            return result.ToString();
        }

    }

    /// <summary>
    /// Class biểu diễn dữ liệu đầu vào cho hàm CosinSimilarity
    /// </summary>
    public class CosinSimilarityInput
    {
        /// <summary>
        /// Mảng dữ liệu thứ nhất
        /// </summary>
        public float[]? FirstVector { get; set; }

        /// <summary>
        /// Mảng dữ liệu thứ hai
        /// </summary>
        public float[]? SecondVector { get; set; }
    }
}