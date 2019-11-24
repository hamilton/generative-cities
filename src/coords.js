

export const makePoints = (height, W, H) => {
	return (cx, cy) => {
		return {
			lx: cx * W + cy * W,
			ly: height / 2 + cx * (H / 2) - cy * (H / 2),
			tx: cx * W + cy * W + W,
			ty: height / 2 + cx * (H / 2) - cy * (H / 2) - H / 2,
			rx: cx * W + cy * W + W * 2,
			ry: height / 2 + cx * (H / 2) - cy * (H / 2),
			bx: cx * W + cy * W + W,
			by: height / 2 + cx * (H / 2) - cy * (H / 2) - H / 2 + H
		}
	}
}