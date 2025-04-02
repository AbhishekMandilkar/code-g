-- Insert dummy code review rules for Frontend React and TypeScript repository
INSERT INTO "CodeReviewRules" ("id", "rule", "repoId") VALUES
    ('1', 'Use TypeScript strict mode and avoid using "any" type', 'frontend-repo'),
    ('2', 'Components should be functional and follow React hooks best practices', 'frontend-repo'),
    ('3', 'Use proper prop types and interfaces for component props', 'frontend-repo'),
    ('4', 'Implement proper error boundaries for error handling', 'frontend-repo'),
    ('5', 'Follow consistent naming conventions (PascalCase for components, camelCase for functions)', 'frontend-repo'),
    ('6', 'Keep components small and focused on a single responsibility', 'frontend-repo'),
    ('7', 'Use proper dependency arrays in useEffect hooks', 'frontend-repo'),
    ('8', 'Implement proper accessibility (ARIA labels, semantic HTML)', 'frontend-repo'),
    ('9', 'Write unit tests for components using React Testing Library', 'frontend-repo'),
    ('10', 'Use proper state management (Context API or Redux) for global state', 'frontend-repo'),
    ('11', 'Implement proper loading states and error handling in async operations', 'frontend-repo'),
    ('12', 'Use CSS modules or styled-components for styling to avoid conflicts', 'frontend-repo'),
    ('13', 'Follow React performance best practices (useMemo, useCallback when needed)', 'frontend-repo'),
    ('14', 'Implement proper form validation using libraries like Formik or React Hook Form', 'frontend-repo'),
    ('15', 'Use proper TypeScript utility types and avoid type assertions', 'frontend-repo'); 