import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Route from 'route-parser';

const getPathTokens = pathname => {
  const paths = ['/'];

  if (pathname === '/') return paths;
  pathname.split('/').reduce((prev, curr) => {
    const currPath = `${prev}/${curr}`;
    paths.push(currPath);
    return currPath;
  });
  return paths;
};

function getRouteMatch(routes, path) {
  let foundKeys = [];
  Object.keys(routes).map(key => {
    let route = new Route(routes[key].path);
    if (route.match(path)) {
      foundKeys.push(routes[key]);
    }
  });
  return foundKeys[0];
}

function getBreadcrumbs({ routes, match, location }) {
  const pathTokens = getPathTokens(location.pathname);
  return pathTokens.map((path, i) => {
    const routeMatch = getRouteMatch(routes, path);
    if (routeMatch) {
      const routeValue = routes[routeMatch.path];
      return { ...routeValue, path };
    } else {
      return { displayName: null, path: null };
    }
  });
}

function Breadcrumbs({ routes, match, location }) {
  const breadcrumbs = getBreadcrumbs({ routes, match, location });
  return (
    <nav aria-label="You are here:" role="navigation">
      <ul className="breadcrumbs">
        {breadcrumbs.map((breadcrumb, i) => {
          if (breadcrumb.path && breadcrumb.name) {
            if (i === breadcrumbs.length - 1) {
              return (
                <li key={breadcrumb.path}>
                  <span>{breadcrumb.name}</span>
                </li>
              );
            } else {
              return (
                <li key={breadcrumb.path}>
                  <Link to={breadcrumb.path}>{breadcrumb.name}</Link>
                </li>
              );
            }
          } else {
            return null;
          }
        })}
      </ul>
    </nav>
  );
}

export default withRouter(Breadcrumbs);
