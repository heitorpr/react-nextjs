#!/usr/bin/env python3
"""
Development server script with auto-reload
"""

import uvicorn
import os
from pathlib import Path


def main():
    """Main entry point for the development server"""
    # Set environment variables for development
    os.environ.setdefault("ENVIRONMENT", "development")

    # Run the development server
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=["app"],
        log_level="info",
    )


if __name__ == "__main__":
    main()
