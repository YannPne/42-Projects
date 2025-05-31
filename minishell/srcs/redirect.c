/* ************************************************************************** */
/*																			*/
/*														:::	  ::::::::   */
/*   instructions.c									 :+:	  :+:	:+:   */
/*													+:+ +:+		 +:+	 */
/*   By: mmacia <marvin@42.fr>					  +#+  +:+	   +#+		*/
/*												+#+#+#+#+#+   +#+		   */
/*   Created: 2024/07/23 16:08:02 by mmacia			#+#	#+#			 */
/*   Updated: 2024/07/23 16:08:04 by mmacia		   ###   ########.fr	   */
/*																			*/
/* ************************************************************************** */
#include "../header/minishell.h"

void	unset(char *input, t_env_var *env)
{
	unset_var(env, name_key(input));
}

int	multiple_redirect(char *input, char *metachar, int len, int first_meta)
{
	int	i;

	i = 0;
	while (input[i])
	{
		len = 0;
		while (input[i] == metachar[len])
			if (i++ && len++ == (int)strlen(metachar))
				break ;
		if (len == (int)strlen(metachar))
			break ;
		i++;
	}
	first_meta = i - (int)strlen(metachar) + 1;
	while (input[i])
	{
		len = 0;
		while (input[i] == metachar[len])
			if (i++ && len++ == (int)strlen(metachar))
				return (first_meta + 1);
		if (len == (int)strlen(metachar))
			return (first_meta + 1);
		i++;
	}
	return (0);
}

int	redirect_input2(char *input, t_env_var *env,
			int m_redirect, char *metachar)
{
	int		fd;
	int		m_redirect_pos;
	int		saved_stdout;
	char	*file;
	FILE	*fdd;

	file = check_folder_redirect_input(input + m_redirect, metachar, 0);
	if (ft_strlen(metachar) == 2)
		fd = open(file, O_WRONLY | O_CREAT | O_APPEND, 0644);
	else
		fd = open(file, O_WRONLY | O_CREAT | O_TRUNC, 0644);
	m_redirect_pos = multiple_redirect(input + m_redirect, metachar, 0, 0);
	if (m_redirect_pos >= 1)
	{
		close(fd);
		return (redirect_input(input, metachar, env,
				m_redirect + m_redirect_pos));
	}
	saved_stdout = dup(STDOUT_FILENO);
	close(fd);
	fdd = fopen(file, "w");
	fprintf(fdd, "test");
	fclose(fdd);
	return (saved_stdout);
}

int	redirect_input(char *input, char *metachar,
			t_env_var *env, int m_redirect)
{
	int		saved_stdout;
	int		i;
	char	*saved_input;

	i = 1;
	saved_stdout = redirect_input2(input, env, m_redirect, metachar);
	saved_stdout = saved_stdout;
	while (input[++i])
	{
		if (input[i] == '>')
			break ;
		i++;
	}
	saved_input = calloc((i + 1), sizeof(char));
	i = -1;
	while (input[++i])
	{
		if (input[i] == '>')
			break ;
		saved_input[i] = input[i];
	}
	saved_input[i] = '\0';
	return (0);
}

void	env(t_env_var *env)
{
	while (env)
	{
		if (env->global)
		{
			if (env->key)
				printf("%s = ", env->key);
			if (env->value)
				printf("%s\n", env->value);
		}
		env = env->next;
	}
}
