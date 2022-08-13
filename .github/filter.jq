reduce inputs as $line ({}; .[input_filename | split("/")[-1] | split(".")[0]] += [$line]) | map_values(join(""))
