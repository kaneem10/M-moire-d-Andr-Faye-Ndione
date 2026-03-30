import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    if (hasError) {
      let errorMessage = "Une erreur inattendue est survenue.";
      
      try {
        const parsedError = JSON.parse(error?.message || "");
        if (parsedError.error && parsedError.error.includes("Missing or insufficient permissions")) {
          errorMessage = "Vous n'avez pas les permissions nécessaires pour effectuer cette action.";
        }
      } catch (e) {
        // Not a JSON error message
      }

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-beige-light/20 rounded-2xl border border-beige-dark/50">
          <h2 className="serif text-2xl font-medium mb-4 text-text-dark">Désolé, quelque chose s'est mal passé.</h2>
          <p className="text-text-mid mb-8 max-w-md">{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-olive text-white rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-olive/90 transition-colors"
          >
            Recharger la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
