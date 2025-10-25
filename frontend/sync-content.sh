#!/bin/bash

echo "Syncing content files to public directory..."
cp -r content/* public/content/
echo "Done! Content files synced successfully."
echo ""
echo "Your changes are now visible. Refresh your browser to see updates."
