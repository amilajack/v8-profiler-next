#ifndef INNER_V8_H_
#define INNER_V8_H_

#include "nan.h"

namespace nodex
{
  /**
   * A compatible class for v8::HandleScope. Not using Nan::HandleScope because of
   * its implicit v8::Isolate::GetCurrent.
   */
  class HandleScope
  {
    v8::HandleScope scope_;

  public:
    inline HandleScope(v8::Isolate *isolate) : scope_(isolate) {}
    inline static int NumberOfHandles(v8::Isolate *isolate)
    {
      return v8::HandleScope::NumberOfHandles(isolate);
    }

  private:
    // Make it hard to create heap-allocated or illegal handle scopes by
    // disallowing certain operations.
    HandleScope(const HandleScope &) = delete;
    void operator=(const HandleScope &) = delete;
    void *operator new(size_t size) = delete;
    void operator delete(void *, size_t) = delete;
  };

  inline v8::Isolate *TryGetCurrentIsolate()
  {
#if NODE_MODULE_VERSION >= NODE_16_0_MODULE_VERSION
    return v8::Isolate::TryGetCurrent();
#else
    return v8::Isolate::GetCurrent();
#endif
  }

} // namespace xprofiler

#endif /* INNER_V8_H_ */
