package com.stockexchangern.app

import android.app.Application
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactNativeHost

class MainApplication : Application(), ReactApplication {
    override val reactNativeHost: ReactNativeHost = object : DefaultReactNativeHost(this) {
        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG
        override fun getPackages(): MutableList<ReactPackage> = mutableListOf()
        override fun getJSMainModuleName(): String = "index"
        override val isNewArchEnabled: Boolean = false
        override val isHermesEnabled: Boolean = true
    }
}
