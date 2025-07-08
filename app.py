from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import numpy as np
import rasterio
import tempfile
import os

app = Flask(__name__)
CORS(app)

# Load elevation and landcover TIFFs once
elevation_path = "elevation.tif"
landcover_path = "landcover.tif"

with rasterio.open(elevation_path) as elev_src:
    elevation = elev_src.read(1)
    elev_transform = elev_src.transform
    elev_crs = elev_src.crs

with rasterio.open(landcover_path) as land_src:
    landcover = land_src.read(1)

# Helper to compute bounds from transform
def get_bounds(transform, width, height):
    west, north = transform * (0, 0)
    east, south = transform * (width, height)
    return [[south, west], [north, east]]  # [[southWest], [northEast]]

@app.route('/simulate', methods=['POST'])
def simulate_fire():
    data = request.json
    lat = data['lat']
    lon = data['lon']
    hours = int(data['hours'])

    print(f"🔥 Simulating fire at lat={lat}, lon={lon}, for {hours} hours")

    # Get pixel position
    row, col = rasterio.transform.rowcol(elev_transform, lon, lat)

    # Dummy spread radius logic
    radius = hours * 3  # You can make this smarter later

    # Create fire spread mask
    fire_mask = np.zeros_like(elevation, dtype=np.uint8)
    for r in range(fire_mask.shape[0]):
        for c in range(fire_mask.shape[1]):
            if (r - row) ** 2 + (c - col) ** 2 <= radius ** 2:
                fire_mask[r, c] = 1

    # Save the result to temporary GeoTIFF
    tmp_path = tempfile.mktemp(suffix=".tif")
    with rasterio.open(
        tmp_path, 'w',
        driver='GTiff',
        height=fire_mask.shape[0],
        width=fire_mask.shape[1],
        count=1,
        dtype=rasterio.uint8,
        crs=elev_crs,
        transform=elev_transform
    ) as dst:
        dst.write(fire_mask, 1)

    bounds = get_bounds(elev_transform, fire_mask.shape[1], fire_mask.shape[0])

    return jsonify({
        "image_url": f"/get_fire_mask?path={tmp_path}",
        "bounds": bounds
    })

@app.route('/get_fire_mask')
def get_fire_mask():
    path = request.args.get("path")
    if not os.path.exists(path):
        return "Not Found", 404
    return send_file(path, mimetype='image/tiff')

if __name__ == '__main__':
    app.run(debug=True)
