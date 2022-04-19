#pragma once

#include <memory>
#include <utility>

#include <jsi/jsi.h>

#include <JsiSkHostObjects.h>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdocumentation"

#include <modules/svg/include/SkSVGDOM.h>
#include <modules/svg/include/SkSVGSVG.h>

#pragma clang diagnostic pop

namespace RNSkia {

using namespace facebook;

class JsiSkSVG : public JsiSkWrappingSkPtrHostObject<SkSVGDOM> {
public:
  JsiSkSVG(std::shared_ptr<RNSkPlatformContext> context, sk_sp<SkSVGDOM> svgdom)
      : JsiSkWrappingSkPtrHostObject<SkSVGDOM>(std::move(context), std::move(svgdom)){}

  JSI_PROPERTY_GET(__typename__) {
    return jsi::String::createFromUtf8(runtime, "SVG");
  }

  JSI_EXPORT_PROPERTY_GETTERS(JSI_EXPORT_PROP_GET(JsiSkSVG, __typename__))

  /**
    Returns the underlying object from a host object of this type
   */
  static sk_sp<SkSVGDOM> fromValue(jsi::Runtime &runtime,
                                   const jsi::Value &obj) {
    return obj.asObject(runtime)
        .asHostObject<JsiSkSVG>(runtime)
        ->getObject();
  }
};

class JsiSkSVGSVG : public JsiSkWrappingSkPtrHostObject<SkSVGSVG> {
public:
    JsiSkSVGSVG(std::shared_ptr<RNSkPlatformContext> context, sk_sp<SkSVGSVG> svg)
            : JsiSkWrappingSkPtrHostObject<SkSVGSVG>(std::move(context), std::move(svg)){}

    JSI_PROPERTY_GET(__typename__) {
        return jsi::String::createFromUtf8(runtime, "SVGSVG");
    }

    JSI_EXPORT_PROPERTY_GETTERS(JSI_EXPORT_PROP_GET(JsiSkSVG, __typename__))

    /**
      Returns the underlying object from a host object of this type
     */
    static sk_sp<SkSVGSVG> fromValue(jsi::Runtime &runtime,
                                     const jsi::Value &obj) {
        return obj.asObject(runtime)
                .asHostObject<JsiSkSVGSVG>(runtime)
                ->getObject();
    }
};
} // namespace RNSkia
