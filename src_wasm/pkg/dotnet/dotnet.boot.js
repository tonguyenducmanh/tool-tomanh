export const config = /*json-start*/{
  "mainAssemblyName": "Tools.NetWrapper.dll",
  "resources": {
    "hash": "sha256-yGiTuGKAqHW4CkcRzpG/PT4VuD0IvS1wfMpP4+JJlXE=",
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
        "hash": "sha256-c28dx0kVG+Dos7fpy/OkmaK8RZOrWdg5mZ8wVgiGWio="
      }
    ],
    "wasmSymbols": [
      {
        "name": "dotnet.native.js.symbols"
      }
    ],
    "coreAssembly": [
      {
        "virtualPath": "System.Private.CoreLib.wasm",
        "name": "System.Private.CoreLib.wasm",
        "hash": "sha256-d1DXKS4PW5bBRmKzQTCIHg2Mf1/BLCBigik6lYfKEH4="
      },
      {
        "virtualPath": "System.Runtime.InteropServices.JavaScript.wasm",
        "name": "System.Runtime.InteropServices.JavaScript.wasm",
        "hash": "sha256-8sLPigJG/lC5XBVLcMl4jkh6z3uCvR4XGzJQTQkJ4Fo="
      }
    ],
    "assembly": [
      {
        "virtualPath": "Npgsql.wasm",
        "name": "Npgsql.wasm",
        "hash": "sha256-A8ZefxAklj5IjR4TGjgCgoqGdeuvxA6TzOss/eSUpQE="
      },
      {
        "virtualPath": "System.Collections.Concurrent.wasm",
        "name": "System.Collections.Concurrent.wasm",
        "hash": "sha256-6ieKwxvhZQbx6pZcc8uzkGIpp/4N2tXlOpwyQ0Dy5Sk="
      },
      {
        "virtualPath": "System.ComponentModel.Primitives.wasm",
        "name": "System.ComponentModel.Primitives.wasm",
        "hash": "sha256-PS9U2NWgozPTJ1eg6Nq6EBOpnsqctHZZ+awYNVOaKnA="
      },
      {
        "virtualPath": "System.ComponentModel.TypeConverter.wasm",
        "name": "System.ComponentModel.TypeConverter.wasm",
        "hash": "sha256-pnElD2NSCujyv5i99odE86m1M/urDgpQOcwCfxEHmtM="
      },
      {
        "virtualPath": "System.Data.Common.wasm",
        "name": "System.Data.Common.wasm",
        "hash": "sha256-49lEB39nJXTCUSalU9KKzwj2AnMsSn0kpMTbqU+HiWM="
      },
      {
        "virtualPath": "System.IO.Pipelines.wasm",
        "name": "System.IO.Pipelines.wasm",
        "hash": "sha256-7N+scuN8nmiU+QbLyZpP/FeRS5FYzMOKMTSW7NAJetA="
      },
      {
        "virtualPath": "System.Memory.wasm",
        "name": "System.Memory.wasm",
        "hash": "sha256-kuXhuWnT7UW/eBfMeYFz1w3kMyNT9xP3SdzPD4oo9UU="
      },
      {
        "virtualPath": "System.Text.Encodings.Web.wasm",
        "name": "System.Text.Encodings.Web.wasm",
        "hash": "sha256-rELIEiGL/VhmkBfSywQ2HMdxEWtm9oEH7rDYFBFdjLA="
      },
      {
        "virtualPath": "System.Text.Json.wasm",
        "name": "System.Text.Json.wasm",
        "hash": "sha256-0RBWIG9/T1ViaM0H9PUfW05YUXf2b+QTCNsB0pW8bZ0="
      },
      {
        "virtualPath": "System.Text.RegularExpressions.wasm",
        "name": "System.Text.RegularExpressions.wasm",
        "hash": "sha256-474T4dsZyOBv7P0FPkn7MC79SqKrGpqqZqnmmCb/Zds="
      },
      {
        "virtualPath": "Tools.NetWrapper.wasm",
        "name": "Tools.NetWrapper.wasm",
        "hash": "sha256-+deWtKsatweEooSy0rHZcYRsBdLAXDGErd4Y0cwHEpk="
      }
    ]
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