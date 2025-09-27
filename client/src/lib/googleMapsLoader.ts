import { Loader } from "@googlemaps/js-api-loader";

// Centralized Google Maps loader to prevent conflicts
class GoogleMapsLoaderSingleton {
  private static instance: GoogleMapsLoaderSingleton;
  private loader: Loader | null = null;
  private isLoaded = false;
  private loadPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): GoogleMapsLoaderSingleton {
    if (!GoogleMapsLoaderSingleton.instance) {
      GoogleMapsLoaderSingleton.instance = new GoogleMapsLoaderSingleton();
    }
    return GoogleMapsLoaderSingleton.instance;
  }

  public async load(): Promise<void> {
    if (this.isLoaded) {
      return Promise.resolve();
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
    if (!apiKey) {
      throw new Error("Missing VITE_GOOGLE_MAPS_API_KEY env var");
    }

    // Initialize loader with all required libraries
    this.loader = new Loader({
      apiKey,
      version: "weekly",
      libraries: ["places"], // Include places library for autocomplete functionality
    });

    this.loadPromise = this.loader.load().then(() => {
      this.isLoaded = true;
    });

    return this.loadPromise;
  }

  public isGoogleMapsLoaded(): boolean {
    return this.isLoaded;
  }
}

// Export singleton instance
export const googleMapsLoader = GoogleMapsLoaderSingleton.getInstance();

// Convenience function for components
export const loadGoogleMaps = (): Promise<void> => {
  return googleMapsLoader.load();
};
