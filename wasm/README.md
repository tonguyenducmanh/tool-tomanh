# Project này tập trung vào việc build ra webasembly cho code js có thể gọi được vào code c#

đầu tiên, cần cài đặt .NET 9.0

chạy các command sau ở terminal

# tạo workload

```
dotnet workload install wasm-tools;
```

# tạo project console

thay thế <ProjectName> bằng tên app mong muốn

dotnet new console -n <ProjectName>

# cấu hình

file .csproj cần có các cấu hình như sau:

```
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net9.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>
  <PropertyGroup>
    <RunTimeIdentifier>browser-wasm</RunTimeIdentifier>
    <TrimMode>full</TrimMode>
    <InvariantGlobalization>true</InvariantGlobalization>
    <EnableCompressionInSingleFile>true</EnableCompressionInSingleFile>
    <AllowUnsafeBlocks>true</AllowUnsafeBlocks>
  </PropertyGroup>
</Project>
```

# Demo việc export hàm C# để gọi từ js sau này

file MyWasm.cs

```
using System.Runtime.InteropServices.JavaScript;
using System.Text.Json;
using System.Text.Json.Serialization;
namespace MyApp.Controls.Wasm
{
    public static partial class MyWasm
    {
        [JSExport]
        public static string GetData()
        {
            return "Hello from MyApp.Controls.Wasm!";
        }
    }
}
```

file Program.cs

```
using MyApp.Controls.Wasm;

public class Program
{
    public static void Main(string[] args)
    {
        // Entry point for the WebAssembly application.
        var message = MyWasm.GetData();
        Console.WriteLine(message);
    }
}
```

# Build app thành file assembly

```
dotnet publish -c Release
```

# vào thư mục sau và copy folder này vào trong source js

/bin/Release/net9.0/browser-wasm/AppBundle/\_framework

# Cách sử dụng ở code js

```
import { dotnet } from "/public/_framework/dotnet.js";

const runtime = await dotnet.create();
runtime.setModuleImports("globalThis", globalThis);

// demo gọi hàm từ blazor wasm
// const { getAssemblyExports } = runtime;
// const exports = await getAssemblyExports("MyApp.Controls.Wasm.dll");
// let temp = exports.MyApp.Controls.Wasm.MyWasm.GetData();
// console.log("Data from Blazor:", temp);
// debugger;

// gán runtime vào window để các module khác có thể dùng
window.__dotnet_runtime = runtime;
```
