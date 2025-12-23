# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Keep Capacitor classes
-keep class com.getcapacitor.** { *; }
-keep class com.loadgistix.www.** { *; }

# Keep JavaScript interface for WebView
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep WebView JavaScript bridge
-keepattributes JavascriptInterface

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep annotations
-keepattributes *Annotation*

# Keep source file names and line numbers for debugging
-keepattributes SourceFile,LineNumberTable

# Keep Capacitor plugins
-keep class com.capacitorjs.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keep @com.getcapacitor.Plugin class * { *; }

# Keep all plugin classes
-keep class * extends com.getcapacitor.Plugin { *; }

# Keep Capacitor BridgeActivity
-keep class * extends com.getcapacitor.BridgeActivity { *; }

# Keep Parcelables
-keep class * implements android.os.Parcelable {
  public static final android.os.Parcelable$Creator *;
}

# Keep Serializable
-keepnames class * implements java.io.Serializable
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    !static !transient <fields>;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# Keep Android lifecycle methods
-keepclassmembers class * extends android.app.Activity {
    public void *(android.view.View);
}

# Keep cordova plugins
-keep class org.apache.cordova.** { *; }

# Keep notification classes
-keep class androidx.core.app.NotificationCompat** { *; }
