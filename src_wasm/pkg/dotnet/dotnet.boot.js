export const config = /*json-start*/{
  "mainAssemblyName": "Tools.NetWrapper.dll",
  "resources": {
    "hash": "sha256-gUbW7crq/P9w6PEBN5UQJzhmUGXzZ0t/eXEl1FMwql8=",
    "jsModuleNative": [
      {
        "name": "dotnet.native.js"
      }
    ],
    "jsModuleRuntime": [
      {
        "name": "dotnet.runtime.js"
      }
    ],
    "wasmNative": [
      {
        "name": "dotnet.native.wasm",
        "hash": "sha256-sA1xEjFTmTzozLMm2T+kKtfEVHgLNgUNFTcNKkgXmPU="
      }
    ],
    "coreAssembly": [
      {
        "virtualPath": "Npgsql.wasm",
        "name": "Npgsql.wasm",
        "hash": "sha256-HZhTjc8J/BWNTWfQ0AoqqPesQJKhceHzTZXEhVJZhJM="
      },
      {
        "virtualPath": "System.Collections.Concurrent.wasm",
        "name": "System.Collections.Concurrent.wasm",
        "hash": "sha256-ZiEDLiZDWqIf554xQE1jHuZnNV2kxCcHYFf576lEoQg="
      },
      {
        "virtualPath": "System.ComponentModel.Primitives.wasm",
        "name": "System.ComponentModel.Primitives.wasm",
        "hash": "sha256-CwjruoE3ZLYtLQ7ZkdlKdLeazDx0vu1j4Wtq5mpG+qc="
      },
      {
        "virtualPath": "System.ComponentModel.TypeConverter.wasm",
        "name": "System.ComponentModel.TypeConverter.wasm",
        "hash": "sha256-TfkqUG704EgirkHWlqi4ZdupYZok/JU+hxtEXN9krXs="
      },
      {
        "virtualPath": "System.Data.Common.wasm",
        "name": "System.Data.Common.wasm",
        "hash": "sha256-GfZ6VqustAq7lixHNgxi/zeR+FVQMCLvj+gBvFG8gv4="
      },
      {
        "virtualPath": "System.IO.Pipelines.wasm",
        "name": "System.IO.Pipelines.wasm",
        "hash": "sha256-F+momQ5WP4xfA/Vq9jEIevqHrrx2YXHsyrF9owt1h8w="
      },
      {
        "virtualPath": "System.Memory.wasm",
        "name": "System.Memory.wasm",
        "hash": "sha256-kuXhuWnT7UW/eBfMeYFz1w3kMyNT9xP3SdzPD4oo9UU="
      },
      {
        "virtualPath": "System.Private.CoreLib.wasm",
        "name": "System.Private.CoreLib.wasm",
        "hash": "sha256-k6BNS7/WgtfiRIc2iQw5JpGDepQUXCHYOZVT5LLSgxQ="
      },
      {
        "virtualPath": "System.Runtime.InteropServices.JavaScript.wasm",
        "name": "System.Runtime.InteropServices.JavaScript.wasm",
        "hash": "sha256-+tbdH4NH438a4QEsl+w0OQ/a3Pnuna+ItCGyp6eHo/M="
      },
      {
        "virtualPath": "System.Text.Encodings.Web.wasm",
        "name": "System.Text.Encodings.Web.wasm",
        "hash": "sha256-PbeATYGatiUbYiFc5G1kynR66ksMd5pHMhRNwJtH5Xc="
      },
      {
        "virtualPath": "System.Text.Json.wasm",
        "name": "System.Text.Json.wasm",
        "hash": "sha256-ZQZYtNVX/ZQzV1OtDwn5HkQNUypXg32ZpR6d1uMpCak="
      },
      {
        "virtualPath": "System.Text.RegularExpressions.wasm",
        "name": "System.Text.RegularExpressions.wasm",
        "hash": "sha256-n4j+N3JvarhFuA72xVBX0D+FSmhvIEQQh2HNWPX8STo="
      },
      {
        "virtualPath": "Tools.NetWrapper.wasm",
        "name": "Tools.NetWrapper.wasm",
        "hash": "sha256-E159EbSJFqaFWBKyZyUpgDTOGMCxy7egQf/tvLAtvx4="
      }
    ],
    "assembly": []
  },
  "debugLevel": 0,
  "globalizationMode": "invariant",
  "runtimeConfig": {
    "runtimeOptions": {
      "configProperties": {
        "Microsoft.Extensions.DependencyInjection.VerifyOpenGenericServiceTrimmability": true,
        "System.ComponentModel.DefaultValueAttribute.IsSupported": false,
        "System.ComponentModel.Design.IDesignerHost.IsSupported": false,
        "System.ComponentModel.TypeConverter.EnableUnsafeBinaryFormatterInDesigntimeLicenseContextSerialization": false,
        "System.ComponentModel.TypeDescriptor.IsComObjectDescriptorSupported": false,
        "System.Data.DataSet.XmlSerializationIsSupported": false,
        "System.Diagnostics.Debugger.IsSupported": false,
        "System.Diagnostics.Metrics.Meter.IsSupported": false,
        "System.Diagnostics.Tracing.EventSource.IsSupported": false,
        "System.Globalization.Invariant": true,
        "System.TimeZoneInfo.Invariant": false,
        "System.Globalization.PredefinedCulturesOnly": true,
        "System.Linq.Enumerable.IsSizeOptimized": true,
        "System.Net.Http.EnableActivityPropagation": false,
        "System.Net.Http.WasmEnableStreamingResponse": true,
        "System.Net.SocketsHttpHandler.Http3Support": false,
        "System.Reflection.Metadata.MetadataUpdater.IsSupported": false,
        "System.Resources.ResourceManager.AllowCustomResourceTypes": false,
        "System.Resources.UseSystemResourceKeys": true,
        "System.Runtime.CompilerServices.RuntimeFeature.IsDynamicCodeSupported": true,
        "System.Runtime.InteropServices.BuiltInComInterop.IsSupported": false,
        "System.Runtime.InteropServices.EnableConsumingManagedCodeFromNativeHosting": false,
        "System.Runtime.InteropServices.EnableCppCLIHostActivation": false,
        "System.Runtime.InteropServices.Marshalling.EnableGeneratedComInterfaceComImportInterop": false,
        "System.Runtime.Serialization.EnableUnsafeBinaryFormatterSerialization": false,
        "System.StartupHookProvider.IsSupported": false,
        "System.Text.Encoding.EnableUnsafeUTF7Encoding": false,
        "System.Text.Json.JsonSerializer.IsReflectionEnabledByDefault": false,
        "System.Threading.Thread.EnableAutoreleasePool": false
      }
    }
  }
}/*json-end*/;