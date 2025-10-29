using System.Numerics.Tensors;
using System.Runtime.InteropServices.JavaScript;
using Newtonsoft.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
namespace Tools.NetWrapper
{
    /// <summary>
    /// Class chứa danh sách các hàm tiện ích liên quan đến Tensor
    /// </summary>
    public static partial class ToolsTensor
    {
        [JSExport]
        public static string CosinSimilarity(string source)
        {
            if (string.IsNullOrEmpty(source))
            {
                throw new ArgumentNullException(nameof(source));
            }
            var input = JsonConvert.DeserializeObject<CosinSimilarityInput>(source);

            if (input == null || input.DataA == null || input.DataB == null)
            {
                throw new ArgumentException("Invalid input data");
            }
            // Tạo hai tensor mẫu
            var result = TensorPrimitives.CosineSimilarity(input.DataA, input.DataB);
            return result.ToString();
        }

        private class CosinSimilarityInput
        {
            public float[] DataA { get; set; }
            public float[] DataB { get; set; }
        }
    }
}