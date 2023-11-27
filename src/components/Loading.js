const Loading = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ margin: 'auto', background: 'transparent', display: 'block', shapeRendering: 'auto' }} width="277px" height="277px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <rect x="19" y="35.5" width="12" height="29" fill="#172b4d">
                <animate attributeName="y" repeatCount="indefinite" dur="0.78125s" calcMode="spline" keyTimes="0;0.5;1" values="21;35.5;35.5" keySplines="0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.15625s" />
                <animate attributeName="height" repeatCount="indefinite" dur="0.78125s" calcMode="spline" keyTimes="0;0.5;1" values="58;29;29" keySplines="0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.15625s" />
            </rect>
            <rect x="44" y="35.5" width="12" height="29" fill="#5e72e4">
                <animate attributeName="y" repeatCount="indefinite" dur="0.78125s" calcMode="spline" keyTimes="0;0.5;1" values="24.625;35.5;35.5" keySplines="0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.078125s" />
                <animate attributeName="height" repeatCount="indefinite" dur="0.78125s" calcMode="spline" keyTimes="0;0.5;1" values="50.75;29;29" keySplines="0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.078125s" />
            </rect>
            <rect x="69" y="35.5" width="12" height="29" fill="#adb5bd">
                <animate attributeName="y" repeatCount="indefinite" dur="0.78125s" calcMode="spline" keyTimes="0;0.5;1" values="24.625;35.5;35.5" keySplines="0 0.5 0.5 1;0 0.5 0.5 1" />
                <animate attributeName="height" repeatCount="indefinite" dur="0.78125s" calcMode="spline" keyTimes="0;0.5;1" values="50.75;29;29" keySplines="0 0.5 0.5 1;0 0.5 0.5 1" />
            </rect>
        </svg>
    )
}
export default Loading