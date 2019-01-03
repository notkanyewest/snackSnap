#!/bin/bash
grunt build && grunt buildcontrol:azure

echo "Finished Azure push successfully."
